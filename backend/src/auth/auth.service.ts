import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto.js';
import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service.js';
import { RegisterDto } from './dto/register.dto.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  //register The user
  async register(registerDto: RegisterDto) {
    const existingUser = await this.usersService.findByEmail(registerDto.email);

    if (existingUser) {
      throw new BadRequestException('Email already exists');
    }

    //hash the user passcode
    const hashedPassword = await bcrypt.hash(
        registerDto.password,
        10,
    );

    return this.usersService.createUser({ ...registerDto, password: hashedPassword });
  }

  //login User
  async login(loginDto: LoginDto){
    const user = await this.usersService.findByEmail(loginDto.email,);

    if(!user){
        throw new UnauthorizedException('Invalid Email or Password');
    }
     
    //compare the Password with hash pass
    const isPasswordValid = await bcrypt.compare(
        loginDto.password,
        user.password,
    );

    if(!isPasswordValid){
        throw new UnauthorizedException('Invalid Email or Password');
    }
    
    const token = this.jwtService.sign({
        userId: user.id,
        email:user.email,
        role:user.role,
    });

    return{
        accessToken: token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },

  };
}
}
