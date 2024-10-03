const mongoose = require("mongoose");
const Review = require("./review.js");
const Schema = mongoose.Schema;


const listingSchema = new mongoose.Schema({
     title:{
        type:String,
        required:true,
    },
    description:String,
    image:{
       url:String,
       filename:String,
    },
    price:Number,
    location:String,
    country:String,
    reviews:[
        {
            type: Schema.Types.ObjectId,
            ref:"Review",
        },
    ],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User",
    },
});
// work as middle ware to delete review after delting listings
listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
        await Review.deleteMany({_id:{$in: listing.reviews}});
    }
});
const Listing = mongoose.model("Listing",listingSchema);
module.exports = Listing;