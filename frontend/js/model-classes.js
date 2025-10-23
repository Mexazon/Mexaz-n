class User{
    constructor(userType,email,phone,name,description,avatarUrl){
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
    constructor(businessId,categoryId,dishName,description,price,photoUrl){
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
    constructor (authorUserId,reviewedBusinessId,rating,description,createdAt,photo){
    this.authorUserId=authorUserId;
    this.reviewedBusinessId=reviewedBusinessId;
    this.rating=rating;
    this.description=description;
    this.createdAt=createdAt;
    this.photos=photo;
    }
}

export class PostPhoto {
    constructor (photoUrl,photoOrder,){
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
    constructor (alcaldia, colonia){
        this.alcaldia=alcaldia;
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

