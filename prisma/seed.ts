import { UserRole } from "@prisma/client";
import prisma from "../src/Shared/prisma";
import bcrypt from "bcrypt";

const seedSuperAdmin = async () => {
  try {
    const isExist = await prisma.user.findFirst({
      where: {
        role: UserRole.SUPER_ADMIN,
      },
    });
    if (isExist) {
      return {
        message: "Super Admin already exist",
      };
    }
    const hashedPassword = await bcrypt.hash("superadmin1234", 12);
    const superAdminData = await prisma.user.create({
      data: {
        email: "superadmin@gmail.com",
        password: hashedPassword,
        role: UserRole.SUPER_ADMIN,
        // transaction er bodole eivabe kora jai
        admin: {
          create: {
            name: "Super Admin",
            contactNumber: "0171111111",
          },
        },
      },
    });
  } catch (err) {
    console.log(err);
  } finally {
    await prisma.$disconnect();
  }
};
seedSuperAdmin();
