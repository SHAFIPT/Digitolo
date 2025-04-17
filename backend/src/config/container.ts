// In your container.ts file
import { container } from "tsyringe";
import { IPetRepository } from "../repository/Interface/IPet.repository";
import { petRepository } from "../repository/Implementation/petRepository";
import { petService } from "../service/Implementation/Pet.Service";
import { IPetService } from "../service/Interface/IPet.service";
import { petController } from "../controller/petController";
import { IOtpRepository } from "../repository/Interface/IOtpRepository";
import { OtpRepository } from "../repository/Implementation/OtpRepository";
import { IOTPservices } from "../service/Interface/IOtp.Service";
import { OtpService } from "../service/Implementation/Otp.Service";
import { IUserService } from "../service/Interface/IUser.service";
import { UserService } from "../service/Implementation/User.Service";
import { IUserRepository } from "../repository/Interface/IUser.repository";
import { UserAuthRepository } from "../repository/Implementation/UserRepository";
import { userController } from "../controller/userController";
import { ITokenService } from "../service/Interface/Itoken.service";
import { TokenService } from "../service/Implementation/token.service";

// Register interfaces first
container.register<IOtpRepository>("IOtpRepository", { useClass: OtpRepository });
container.register<IOTPservices>("IOtpService", { useClass: OtpService }); 
container.register<ITokenService>("ITokenService", { useClass: TokenService });
container.register<IUserService>("IUserService", { useClass: UserService });
container.register<IUserRepository>("IUserRepository", { useClass: UserAuthRepository }); 
container.register<IPetRepository>("IPetRepository", { useClass: petRepository });
container.register<IPetService>("IPetService", { useClass: petService });

// Then register controllers - THIS IS THE KEY CHANGE
// Register the controllers with token strings instead of classes
container.register("userController", { useClass: userController });
container.register("petController", { useClass: petController });

export { container };