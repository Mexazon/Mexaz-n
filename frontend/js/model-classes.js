class User{
    constructor(userId,userType,email,phone,name,description,avatarUrl){
        this.userId = userId;
        this.userType=userType;
        this.email=email;
        this.phone=phone;
        this.name=name;
        this.description=description;
        this.createdAt=createdAt;
        this.avatarUrl=avatarUrl;
    }
}


export class Dish{
    constructor(dishId,businessId,categoryId,dishName,description,price,photoUrl){
        this.dishId=dishId;
        this.businessId=businessId;
        this.categoryId=categoryId;        
        this.dishName=dishName;
        this.description =description;
        this.price=price;
        this.photoUrl=photoUrl;
    }
}

export class Business {
    constructor(businessId,isActive){
        this.businessId=businessId; 
        this.isActive=isActive;
        this.user;
    }
}

export class MenuCategory {
    constructor (categoryId,categoryName){
    this.categoryId=categoryId;
    this.categoryName=categoryName;
    }
}

export class Post {
    constructor (postId,authorUserId,reviewedBusinessId,rating,description,createdAt,photo){
    this.postId=postId;
    this.authorUserId=authorUserId;
    this.reviewedBusinessId=reviewedBusinessId;
    this.rating=rating;
    this.description=description;
    this.createdAt=createdAt;
    this.photos=photo;
    }
}

export class PostPhoto {
    constructor (postId,photoUrl,photoOrder,){
        this.postId=postId;
        this.photoUrl=photoUrl;
        this.photoOrder=photoOrder;
    }
}

export class PostalCodeCatalog {
    constructor (postalCodeId,alcaldia){
        this.postalCodeId=postalCodeId;
        this.alcaldia=alcaldia;

    }
}

export class PostalCodeId {
    constructor (postalCodeId, colonia){
        this.postalCodeId=postalCodeId;
        this.colonia=colonia;
    }
}

export class UserAddress {
    constructor (userId,postalCode,colonia,street,number){
        this.userId=userId;
        this.postalCode=postalCode;
        this.colonia=colonia;
        this.street=street;
        this.number=number;
    }
}

export class BusinessHours {
    constructor(businessId,timeIn,timeOut,isWorking){
        this.businessId=businessId;
        this.timeIn=timeIn;
        this.timeOut=timeOut;
        this.isWorking=isWorking;

    }
}

export class BusinessHoursId {
    constructor(businessId,dayOfWeek){
        this.businessId=businessId;
        this.dayOfWeek=dayOfWeek; 
    }
}

