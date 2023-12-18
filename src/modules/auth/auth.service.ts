import { Injectable } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";

@Injectable()
export class AuthService {
  #_prisma: PrismaService;

  constructor(prisma: PrismaService){
    this.#_prisma = prisma;
  }


  async register(): Promise<void>{
    
  }

  async login(): Promise<void>{
    
  }

  async refresh(): Promise<void>{

  }

  async logout(): Promise<void>{

  }
}