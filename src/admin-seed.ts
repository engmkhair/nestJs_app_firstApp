import { PrismaService } from 'src/prisma/prisma.service';
import { Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

export async function adminSeed(prisma: PrismaService) {
    
    const adminEmail = 'admin@gmail.com';
    const hashedPassword = await bcrypt.hash('123456', 10);
    const adminExist = await prisma.user.findUnique({
        where: {
          email: adminEmail,
        },
    });

    

    if (!adminExist) {
        return await prisma.user.create({
        data: {
            name: 'Admin',
            password: hashedPassword,
            email: adminEmail,
            role: Role.Admin,
        },
    });
} 
}