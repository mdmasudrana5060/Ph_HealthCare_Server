import {
  Admin,
  Doctor,
  Patient,
  Prisma,
  User,
  UserRole,
  UserStatus,
} from "@prisma/client";
import bcrypt from "bcrypt";
import { fileUploader } from "../../../helpers/uploader";
import { IFile } from "../../interfaces/file";
import prisma from "../../../Shared/prisma";
import { Request } from "express";
import { IPaginationOptions } from "../../interfaces/pagination";
import { paginationHelper } from "../../../helpers/paginationHelpers";
import { userSearchAbleFields } from "./user.constant";
import { IAuthUser } from "../../interfaces/common";

const createAdminIntoDB = async (req: Request): Promise<Admin> => {
  const file = req.file as IFile;
  if (file) {
    const uploadToCloudinary = await fileUploader.sendImageToCloudinary(file);
    req.body.admin.profilePhoto = uploadToCloudinary?.secure_url;
  }

  const payload = req.body;

  const hashedPassword = await bcrypt.hash(payload.password, 12);
  const userData = {
    email: payload.admin.email,
    password: hashedPassword,
    role: UserRole.ADMIN,
  };

  const result = await prisma.$transaction(async (transactionClient) => {
    await transactionClient.user.create({
      data: userData,
    });
    const createAdminIntoDB = await transactionClient.admin.create({
      data: req.body.admin,
    });
    return createAdminIntoDB;
  });
  return result;
};
const createDoctorIntoDB = async (req: Request): Promise<Doctor> => {
  const file = req.file as IFile;
  if (file) {
    const uploadToCloudinary = await fileUploader.sendImageToCloudinary(file);
    req.body.doctor.profilePhoto = uploadToCloudinary?.secure_url;
  }

  const payload = req.body;

  const hashedPassword = await bcrypt.hash(payload.password, 12);
  const userData = {
    email: payload.doctor.email,
    password: hashedPassword,
    role: UserRole.DOCTOR,
  };

  const result = await prisma.$transaction(async (transactionClient) => {
    await transactionClient.user.create({
      data: userData,
    });
    const createDoctorIntoDB = await transactionClient.doctor.create({
      data: req.body.doctor,
    });
    return createDoctorIntoDB;
  });
  return result;
};
const createPatientIntoDB = async (req: Request): Promise<Patient> => {
  const file = req.file as IFile;

  if (file) {
    const uploadedProfileImage = await fileUploader.sendImageToCloudinary(file);
    req.body.patient.profilePhoto = uploadedProfileImage?.secure_url;
  }

  const hashedPassword: string = await bcrypt.hash(req.body.password, 12);

  const userData = {
    email: req.body.patient.email,
    password: hashedPassword,
    role: UserRole.PATIENT,
  };

  const result = await prisma.$transaction(async (transactionClient) => {
    await transactionClient.user.create({
      data: userData,
    });

    const createdPatientData = await transactionClient.patient.create({
      data: req.body.patient,
    });

    return createdPatientData;
  });

  return result;
};

const getAllUserFromDB = async (query: any, options: IPaginationOptions) => {
  const { searchTerm, ...filterData } = query;
  const { limit, page, skip } = paginationHelper.calculatePagination(options);

  let andConditions: Prisma.UserWhereInput[] = [];

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: (filterData as any)[key],
        },
      })),
    });
  }
  if (query.searchTerm) {
    andConditions.push({
      // OR: [
      //   {
      //     name: {
      //       contains: query.searchTerm,
      //       mode: "insensitive",
      //     },
      //   },
      //   {
      //     email: {
      //       contains: query.searchTerm,
      //       mode: "insensitive",
      //     },
      //   },
      // ],
      OR: userSearchAbleFields.map((field) => ({
        [field]: {
          contains: query.searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  const whereConditions: Prisma.UserWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.user.findMany({
    where: whereConditions,

    skip: skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? {
            [options.sortBy]: options.sortOrder,
          }
        : {
            createdAt: "desc",
          },
    select: {
      id: true,
      email: true,
      role: true,
      needsPasswordChange: true,
      status: true,
      createdAt: true,
      updatedAt: true,
      admin: true,
      patient: true,
      doctor: true,
    },
  });
  const total = await prisma.user.count({
    where: whereConditions,
  });
  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};
const changeProfileStatusIntoDB = async (id: string, status: UserRole) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      id,
    },
  });

  const updateUserStatus = await prisma.user.update({
    where: {
      id,
    },
    data: status,
  });

  return updateUserStatus;
};

const getMyProfileFromDB = async (user: IAuthUser) => {
  const userInfo = await prisma.user.findUniqueOrThrow({
    where: {
      email: user?.email,
      status: UserStatus.ACTIVE,
    },
    select: {
      id: true,
      email: true,
      needsPasswordChange: true,
      role: true,
      status: true,
    },
  });
  let profileInfo;
  if (userInfo.role === UserRole.SUPER_ADMIN) {
    profileInfo = await prisma.admin.findUniqueOrThrow({
      where: {
        email: userInfo.email,
      },
    });
  } else if (userInfo.role === UserRole.ADMIN) {
    profileInfo = await prisma.admin.findUniqueOrThrow({
      where: {
        email: userInfo.email,
      },
    });
  } else if (userInfo.role === UserRole.DOCTOR) {
    profileInfo = await prisma.doctor.findUniqueOrThrow({
      where: {
        email: userInfo.email,
      },
    });
  } else if (userInfo.role === UserRole.PATIENT) {
    profileInfo = await prisma.patient.findUniqueOrThrow({
      where: {
        email: userInfo.email,
      },
    });
  }
  return { ...userInfo, ...profileInfo };
};

const updateMyProfileIntoDB = async (user: IAuthUser, req: Request) => {
  const payload = req.body;
  const userInfo = await prisma.user.findUniqueOrThrow({
    where: {
      email: user?.email,
      status: UserStatus.ACTIVE,
    },
    select: {
      id: true,
      email: true,
      needsPasswordChange: true,
      role: true,
      status: true,
    },
  });
  const file = req.file as IFile;
  if (file) {
    const uploadToCloudinary = await fileUploader.sendImageToCloudinary(file);
    req.body.profilePhoto = uploadToCloudinary?.secure_url;
  }
  let profileInfo;
  if (userInfo.role === UserRole.SUPER_ADMIN) {
    profileInfo = await prisma.admin.update({
      where: {
        email: userInfo.email,
      },
      data: payload,
    });
  } else if (userInfo.role === UserRole.ADMIN) {
    profileInfo = await prisma.admin.update({
      where: {
        email: userInfo.email,
      },
      data: payload,
    });
  } else if (userInfo.role === UserRole.DOCTOR) {
    profileInfo = await prisma.doctor.update({
      where: {
        email: userInfo.email,
      },
      data: payload,
    });
  } else if (userInfo.role === UserRole.PATIENT) {
    profileInfo = await prisma.patient.update({
      where: {
        email: userInfo.email,
      },
      data: payload,
    });
  }
  return { ...profileInfo };
};
export const userServices = {
  createAdminIntoDB,
  createDoctorIntoDB,
  createPatientIntoDB,
  getAllUserFromDB,
  changeProfileStatusIntoDB,
  getMyProfileFromDB,
  updateMyProfileIntoDB,
};
