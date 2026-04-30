import { prisma } from "@repo/database";
import { NextFunction, Request, Response } from "express";

export const isAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const admin = prisma.user.findFirst({
    where: {
      id: req.user?.id,
      email: req.user?.email,
    },
  });
  console.log(admin);
  if (!admin) {
    return res.status(401).json({ error: "The Admin Dont Exist" });
  }

  res.end();
};
