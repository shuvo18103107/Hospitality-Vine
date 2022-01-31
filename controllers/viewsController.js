const Room = require('../models/roomModel')
const catchAsync = require('../utilis/catchAsync')
const AppError = require('../utilis/appError')
exports.getOverview = catchAsync(async(req,res,next)=>{

        const rooms = await Room.find()
      res.status(200).render('overview',{

        title: 'This is the overview page',
        rooms
    })
})
exports.getRoom =catchAsync(async (req,res,next)=>{

    const room =await Room.findOne({slug:req.params.slug}).populate({
        path:'reviews',
        select:'review rating user'
    })

    if(!room)
    {
        return next(new AppError('There is no room with that name',404))
    }
 
    res.status(200).render('room',{

        title:`${room.name} Room`,
        room
    })
})

exports.getLoginForm = catchAsync(async(req,res,next)=>{
    
    res.status(200).render('login',{
        title: 'Log into your account'
    })
})
exports.getSignupForm = catchAsync(async(req,res,next)=>{
    res.status(200).render('signup',{
        title: 'Signup'
    })
})
exports.getAccount = (req,res)=>{
    res.status(200).render('account',{
        title: 'Profile Settings'
    })
}

