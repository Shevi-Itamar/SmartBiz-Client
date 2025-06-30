export type userType={
    userName:string,
    userPassword:string,
    userEmail:string,
    userPhone:string,
    userAddress:string,
    role:'admin' | 'user',
    userId?:string,
}