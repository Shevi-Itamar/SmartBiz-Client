export type serviceType={
    
    _id?:string,
    serviceName:string,
    serviceDescription:string,
    price:number,
    duration:number, // in minutes
    imagePath?:string, // optional field for image path
}