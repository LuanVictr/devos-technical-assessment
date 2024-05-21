export interface IUser {
  id?:number;
  name:string;
  email:string;
  address?: string;
  coordinates?:[number, number];
  regions?:any[];
}