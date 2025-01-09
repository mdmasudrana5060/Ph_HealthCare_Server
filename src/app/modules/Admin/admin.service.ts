import { Admin, Prisma, PrismaClient, UserStatus } from "@prisma/client";
import { searchAbleFields } from "./admin.constant";
import { paginationHelper } from "../../../helpers/paginationHelpers";
import { IAdminFilterRequest } from "./admin.interface";
import { IPaginationOptions } from "../../interfaces/pagination";

const prisma = new PrismaClient();

const getAllAdminFromDB = async (
  query: IAdminFilterRequest,
  options: IPaginationOptions
) => {
  const { searchTerm, ...filterData } = query;
  const { limit, page, skip } = paginationHelper.calculatePagination(options);

  let andConditions: Prisma.AdminWhereInput[] = [];

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
      OR: searchAbleFields.map((field) => ({
        [field]: {
          contains: query.searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }
  andConditions.push({
    isDeleted: false,
  });

  const whereConditions: Prisma.AdminWhereInput = { AND: andConditions };

  const result = await prisma.admin.findMany({
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
  });
  const total = await prisma.admin.count({
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

const getAdminByIdFromDB = async (id: string): Promise<Admin | null> => {
  await prisma.admin.findUniqueOrThrow({
    where: {
      id,
      isDeleted: false,
    },
  });
  const result = await prisma.admin.findUnique({
    where: {
      id,
    },
  });
  return result;
};
const updateAdminIntoDB = async (
  id: string,
  data: Partial<Admin>
): Promise<Admin | null> => {
  await prisma.admin.findUniqueOrThrow({
    where: {
      id,
      isDeleted: false,
    },
  });
  const result = await prisma.admin.update({
    where: {
      id,
    },
    data,
  });
  return result;
};
const deleteAdminIntoDB = async (id: string): Promise<Admin | null> => {
  await prisma.admin.findUniqueOrThrow({
    where: {
      id,
      isDeleted: false,
    },
  });

  const result = await prisma.$transaction(async (transactionClient) => {
    const adminDeletedData = await transactionClient.admin.update({
      where: {
        id,
      },
      data: {
        isDeleted: true,
      },
    });

    await transactionClient.user.update({
      where: {
        email: adminDeletedData.email,
      },
      data: {
        status: UserStatus.DELETED,
      },
    });

    return adminDeletedData;
  });

  return result;
};

export const adminServices = {
  getAllAdminFromDB,
  getAdminByIdFromDB,
  updateAdminIntoDB,
  deleteAdminIntoDB,
};
