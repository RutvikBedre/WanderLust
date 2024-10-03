const Listing = require("../models/listing.js")

module.exports.index = async (req,res)=>{
    let allListing = await Listing.find({});
    res.render("./listings/index.ejs",{allListing});
};

module.exports.renderNewForm = (req,res)=>{
    res.render("./listings/new.ejs");
};

module.exports.showListing = async (req,res)=>{
    let { id  } = req.params;
    const listing = await Listing.findById(id)
    .populate({
        path:"reviews",
        populate:{
            path:"author",
        },
    })
    .populate("owner");
    if(!listing){
        req.flash("error","Listing you requested for does not exist!");
        res.redirect("/listing");
    }
    res.render("./listings/show.ejs",{ listing });
};

module.exports.createListing = async (req,res,next)=>{
    let url = req.file.path;
    let filename = req.file.filename;

    const newlisting = new Listing(req.body.listing);
    newlisting.owner = req.user._id;
    newlisting.image = {url,filename};
    await newlisting.save();
    req.flash("success","New listing Created!")
    res.redirect("/listing");
};
module.exports.renderEditForm = async(req,res)=>{
    let { id} =  req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing you requested for does not exist!");
        res.redirect("/listing");
    }
    res.render("./listings/edit.ejs",{ listing});
};  

module.exports.updateListing = async (req,res)=>{
    let {id} = req.params;
    let listing =  await Listing.findByIdAndUpdate(id, {...req.body.listing});

    if(typeof  req.file !== "undefined"){
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = {url,filename};
    await listing.save();
    }
    req.flash("success","Listing Updated!")
    res.redirect(`/listing/${id}`);
};

module.exports.destroyListing = async (req,res)=>{
    let { id } = req.params;
    let deletedlisting = await Listing.findByIdAndDelete(id);
   console.log("listing is deleted");
   req.flash("success","Listing Deleted!")
   res.redirect("/listing");
};