import { CelebrateError } from 'celebrate';

function celebrateError(err: any, req: any, res: any, next: any) {
 
    if (err instanceof CelebrateError) {
      res.status(422).json({message: err.details.get('body')?.message});
    }
  
    next(err);
  }
  
  export default celebrateError;