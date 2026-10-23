import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.models.js";
import {
    uploadOnCloudinary,
    deleteFromCloudinary,
    getCloudinaryAssetFromUrl,
} from "../utils/cloudinary.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";



const generateAccessTokenAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId);
        if (!user) {
          throw new ApiError(404, "User not found");
        }
        const accessToken = await user.generateAccessToken();
        const refreshToken = await user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(500, "Error generating tokens");
    }
}

const registerUser = asyncHandler(async (req, res) => {
    const { fullName, email, username, password } = req.body || {};

    if ([fullName, email, username, password].some(
        (field) => typeof field !== "string" || !field.trim(),
    )) {
        throw new ApiError(400, "All fields are required");
    }

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedUsername = username.trim().toLowerCase();

    const existedUser = await User.findOne({
        $or: [{ email: normalizedEmail }, { username: normalizedUsername }],
    })
    if(existedUser){
        throw new ApiError(409, "User already exists");
    }

    const avatarLocalPath = req.files?.avatar?.[0]?.path;
    const coverLocalPath = req.files?.coverImage?.[0]?.path;

    if(!avatarLocalPath){
        throw new ApiError(400, "Avatar is required");
    }

    // const avatar = await uploadOnCloudinary(avatarLocalPath);
    
    // let coverImage = "";
    // if(coverLocalPath){
    //     coverImage = await uploadOnCloudinary(coverLocalPath);
    // }

    let avatar;
    try {
        avatar = await uploadOnCloudinary(avatarLocalPath);
    } catch (error) {
        throw new ApiError(500, "Error uploading avatar");
    }
    if (!avatar?.url) {
        throw new ApiError(500, "Error uploading avatar");
    }

    let coverImage ;
    if (coverLocalPath) {
        try {
            coverImage = await uploadOnCloudinary(coverLocalPath);
        } catch (error) {
            await deleteFromCloudinary(avatar.public_id);
            throw new ApiError(500, "Error uploading cover image");
        }
        if (!coverImage?.url) {
            await deleteFromCloudinary(avatar.public_id);
            throw new ApiError(500, "Error uploading cover image");
        }
    }

    try {
        const user = await User.create({
          fullName,
          avatar: avatar.url,
          avatarPublicId: avatar.public_id,
          coverImage: coverImage?.url || "",
          coverImagePublicId: coverImage?.public_id || "",
          email: normalizedEmail,
          username: normalizedUsername,
          password,
        });

        const createdUser = await User.findById(user._id).select(
          "-password -refreshToken"
        );

        if (!createdUser) {
          throw new ApiError(500, "Something went wrong while creating user");
        }

        return res
          .status(201)
          .json(new ApiResponse(201, createdUser, "User created successfully"));

    } catch (error){
        console.error("Error creating user:", error);
        if(avatar){
            await deleteFromCloudinary(avatar.public_id);
        }
        if(coverImage){
            await deleteFromCloudinary(coverImage.public_id);
        }
        if (error?.code === 11000) {
            throw new ApiError(409, "Email or username already exists");
        }
        throw new ApiError(500, "Something went wrong while creating user");
    }
    

});

const loginUser = asyncHandler(async (req, res) => {
    const { email, username, password } = req.body || {};

    const hasEmail = typeof email === "string" && Boolean(email.trim());
    const hasUsername = typeof username === "string" && Boolean(username.trim());
    if ((!hasEmail && !hasUsername) || typeof password !== "string" || !password) {
        throw new ApiError(400, "Email or username and password are required");
    }

    const userLookup = hasUsername
        ? { username: username.trim().toLowerCase() }
        : { email: email.trim().toLowerCase() };
    const user = await User.findOne(userLookup);

    if (!user) {
        throw new ApiError(401, "Invalid credentials");
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid credentials");
    }

    const { accessToken, refreshToken } = await generateAccessTokenAndRefreshToken(user._id);

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    if (!loggedInUser) {
        throw new ApiError(500, "Something went wrong while logging in");
    }

    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    };

    return res
        .status(200)
        .cookie("refreshToken", refreshToken, options)
        .cookie("accessToken", accessToken, options)
        .json(new ApiResponse(200, { user: loggedInUser, accessToken }, "User logged in successfully"));
});

const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined,
            }
        },
        { new : true}
    )
    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    };
    return res
        .status(200)
        .clearCookie("refreshToken", options)
        .clearCookie("accessToken", options)
        .json(new ApiResponse(200, {}, "User logged out successfully"));
})

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies?.refreshToken || req.body?.refreshToken;

    if (!incomingRefreshToken) {
        throw new ApiError(401, "Unauthorized request");
    }

    let decodedToken;
    try {
        decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
    } catch (error) {
        throw new ApiError(401, "Invalid refresh token");
    }

    const user = await User.findById(decodedToken?._id).select("-password");
    if (!user || incomingRefreshToken !== user.refreshToken) {
        throw new ApiError(401, "Invalid refresh token");
    }

    const { accessToken, refreshToken: newRefreshToken } = await generateAccessTokenAndRefreshToken(user._id);
    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    };

    return res
        .status(200)
        .cookie("refreshToken", newRefreshToken, options)
        .cookie("accessToken", accessToken, options)
        .json(new ApiResponse(200, { accessToken }, "Access token refreshed successfully"));
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body || {};

    if (typeof oldPassword !== "string" || !oldPassword || typeof newPassword !== "string" || !newPassword) {
        throw new ApiError(400, "Old password and new password are required");
    }

    const user = await User.findById(req.user?._id);
    if (!user) {
        throw new ApiError(404, "User not found");
    }
    const isPasswordValid = await user.isPasswordCorrect(oldPassword);

    if(!isPasswordValid){
        throw new ApiError(401, "Invalid old password");
    }

    user.password = newPassword;
    await user.save({ validateBeforeSave: false });

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Password changed successfully"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
    return res
        .status(200)
        .json(new ApiResponse(200, req.user, "Current user fetched successfully"));
});

const updateAccountDetails = asyncHandler(async (req, res) => {
    const { fullName, email } = req.body || {};

    if (typeof fullName !== "string" || !fullName.trim() || typeof email !== "string" || !email.trim()) {
        throw new ApiError(400, "All fields are required");
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existingEmail = await User.exists({
        email: normalizedEmail,
        _id: { $ne: req.user._id },
    });
    if (existingEmail) throw new ApiError(409, "Email is already in use");

    let user;
    try {
        user = await User.findByIdAndUpdate(
            req.user?._id,
            {
                $set: {
                    fullName: fullName.trim(),
                    email: normalizedEmail,
                }
            },
            { new: true }
        ).select("-password -refreshToken");
    } catch (error) {
        if (error?.code === 11000) throw new ApiError(409, "Email is already in use");
        throw error;
    }

    if (!user) throw new ApiError(404, "User not found");

    return res
        .status(200)
        .json(new ApiResponse(200, user, "Account details updated successfully"));
        
});

const updateUserAvatar = asyncHandler(async (req, res) => {
    const avatarLocalPath = req.file?.path;
    if (!avatarLocalPath) {
        throw new ApiError(400, "File is required");
    }

    const currentUser = await User.findById(req.user?._id).select("+avatarPublicId");
    if (!currentUser) throw new ApiError(404, "User not found");

    let avatar;
    try {
        avatar = await uploadOnCloudinary(avatarLocalPath);
    } catch (error) {
        throw new ApiError(500, "Error while uploading avatar");
    }
    if (!avatar?.url) {
        throw new ApiError(500, "Error while uploading avatar");
    }
    const previousAvatar = getCloudinaryAssetFromUrl(currentUser.avatar);
    const previousAvatarPublicId = currentUser.avatarPublicId || previousAvatar?.publicId;
    let user;
    try {
        user = await User.findByIdAndUpdate(
            req.user?._id,
            {
                $set: {
                    avatar: avatar.url,
                    avatarPublicId: avatar.public_id,
                }
            },
            { new: true }
        ).select("-password -refreshToken");
    } catch (error) {
        await deleteFromCloudinary(avatar.public_id);
        throw error;
    }

    if (!user) {
        await deleteFromCloudinary(avatar.public_id);
        throw new ApiError(404, "User not found");
    }
    if (previousAvatarPublicId && previousAvatarPublicId !== avatar.public_id) {
        await deleteFromCloudinary(previousAvatarPublicId, previousAvatar?.resourceType || "image");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, user, "Avatar updated successfully"));
});

const updateUserCoverImage = asyncHandler(async (req, res) => {
    const coverImageLocalPath = req.file?.path;
    if (!coverImageLocalPath) {
        throw new ApiError(400, "File is required");
    }

    const currentUser = await User.findById(req.user?._id).select("+coverImagePublicId");
    if (!currentUser) throw new ApiError(404, "User not found");

    let coverImage;
    try {
        coverImage = await uploadOnCloudinary(coverImageLocalPath);
    } catch (error) {
        throw new ApiError(500, "Error while uploading cover image");
    }
    if (!coverImage?.url) {
        throw new ApiError(500, "Error while uploading cover image");
    }

    const previousCoverImage = getCloudinaryAssetFromUrl(currentUser.coverImage);
    const previousCoverImagePublicId = currentUser.coverImagePublicId || previousCoverImage?.publicId;
    let user;
    try {
        user = await User.findByIdAndUpdate(
            req.user?._id,
            {
                $set: {
                    coverImage: coverImage.url,
                    coverImagePublicId: coverImage.public_id,
                }
            }, { new: true }
        ).select("-password -refreshToken");
    } catch (error) {
        await deleteFromCloudinary(coverImage.public_id);
        throw error;
    }

    if (!user) {
        await deleteFromCloudinary(coverImage.public_id);
        throw new ApiError(404, "User not found");
    }
    if (previousCoverImagePublicId && previousCoverImagePublicId !== coverImage.public_id) {
        await deleteFromCloudinary(previousCoverImagePublicId, previousCoverImage?.resourceType || "image");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, user, "Cover image updated successfully"));
});

const getUserChannelProfile = asyncHandler(async (req, res) => {
    const { username } = req.params;
    if (!username?.trim()) {
        throw new ApiError(400, "Username is required");
    }

    const channel = await User.aggregate(
        [
            {
                $match : {
                    username: username?.toLowerCase()
                }
            },
            {
                $lookup: {
                    from: "subscriptions",
                    localField: "_id",
                    foreignField: "channel",
                    as: "subscribers"
                }
            },
            {
                $lookup: {
                    from: "subscriptions",
                    localField: "_id",
                    foreignField: "subscriber",
                    as: "subscribedTo"
                }
            }, 
            {
                $addFields: {
                    subscribersCount: { $size: "$subscribers" },
                    channelSubscribedToCount: { $size: "$subscribedTo" },
                    isSubscribed: {
                        $cond: {
                            if: { $in: [req.user?._id, "$subscribers.subscriber"] },
                            then: true,
                            else: false
                        }
                    }
                }
            },
            {
                $project: {
                    fullName: 1,
                    username: 1,
                    avatar: 1,
                    coverImage: 1,
                    subscribersCount: 1,
                    channelSubscribedToCount: 1,
                    isSubscribed: 1
                }
            }
        ]
    )

    if (!channel?.length) {
        throw new ApiError(404, "Channel not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, channel[0], "Channel profile fetched successfully"));
});

const getUserWatchHistory = asyncHandler(async (req, res) => {
    const user = await User.aggregate(
        [
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(req.user?._id)
                }
            },
            {
                $lookup: {
                    from: "videos",
                    localField: "watchHistory",
                    foreignField: "_id",
                    as: "watchHistory",
                    pipeline: [
                        {
                            $lookup: {
                                from: "users",
                                localField: "owner",
                                foreignField: "_id",
                                as: "owner",
                                pipeline: [
                                    {
                                        $project: {
                                            fullName: 1,
                                            username: 1,
                                            avatar: 1
                                        }
                                    }
                                ]
                            }
                        },
                        {
                            $addFields: {
                                owner: {
                                    $first: "$owner"
                                }
                            }
                        }
                    ]
                }
            }
        ]
    )
    if (!user?.length) {
        throw new ApiError(404, "User not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, user[0]?.watchHistory, "User watch history fetched successfully"));
});

export { 
    registerUser,
    loginUser,
    logoutUser,
    generateAccessTokenAndRefreshToken,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    updateUserAvatar,
    updateUserCoverImage,
    getUserChannelProfile,
    getUserWatchHistory
};
