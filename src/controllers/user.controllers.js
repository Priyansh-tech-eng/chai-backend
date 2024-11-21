import {asyncHandler} from "../utils/asyncHandler.js";
import {apiError} from "../utils/apiError.js"
import {User} from "../models/user.models.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { apiResponce } from "../utils/apiResponce.js";

const registerUser = asyncHandler( async (req, res) => {
    // get userdetails from frontend
    // validation - not empty
    // check if user already exists: username, email
    // check for images check for avtar
    //upload them to cloudinary, avtar
    // create user object -- create entry in db
    // remove password and refresh token field from response
    // check for user creation
    // return res


   const {fullName, email, username, password } = req.body
   console.log("email:", email);

//         if (fullName === "") {
//          throw new apiError(400, "fullname is required") 
//    }

if (
    [fullName, email, username, password].some((field) => 
    field?.trim() === "")
) {
    throw new apiError(400, "All fields are required")
}

 const existedUser = await User.find({
    $or: [{ username }, { email }]
})

if (existedUser) {
    throw new apiError(409, "User with email or username already exists")
}

const avatarLocalPath = req.files?.avatar[0]?.path;
const coverImageLocalpath = req.files?.coverImage[0]?.path;

if (!avatarLocalPath) {
    throw new apiError(400, "Avatar file is required")
}

const avatar = await uploadOnCloudinary(avatarLocalPath)
 const coverImage = await uploadOnCloudinary(coverImageLocalpath)

if (!avatar) {
    throw new apiError(400, "Avatar file is required")
}

const user = await user.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase()
})

const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
)

if (!createdUser) {
    throw new apiError(500, "somthing went wrong while registering the user")
}

return res.status(201).json(
    new apiResponce(200, createdUser, "User register successfully")
)

})

export {
    registerUser,
}