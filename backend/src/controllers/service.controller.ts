import { Request, Response, NextFunction } from 'express';
import { serviceService } from '../services/service.service';
import { categoryService } from '../services/category.service';
import { staffService } from '../services/staff.service';

export class ServiceController {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { categoryId, search, isActive } = req.query;
      const services = await serviceService.getAll({
        categoryId: categoryId as string,
        search: search as string,
        isActive: isActive !== undefined ? isActive === 'true' : undefined,
      });
      res.status(200).json({ status: 'success', data: { services } });
    } catch (err) {
      next(err);
    }
  }

  async getOne(req: Request, res: Response, next: NextFunction) {
    try {
      const service = await serviceService.getByIdOrSlug(req.params.id);
      res.status(200).json({ status: 'success', data: { service } });
    } catch (err) {
      next(err);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const service = await serviceService.create(req.body);
      res.status(201).json({ status: 'success', message: 'Service created successfully', data: { service } });
    } catch (err) {
      next(err);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const service = await serviceService.update(req.params.id, req.body);
      res.status(200).json({ status: 'success', message: 'Service updated successfully', data: { service } });
    } catch (err) {
      next(err);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await serviceService.delete(req.params.id);
      res.status(200).json({ status: 'success', message: 'Service deleted successfully' });
    } catch (err) {
      next(err);
    }
  }
}

export class CategoryController {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const categories = await categoryService.getAll();
      res.status(200).json({ status: 'success', data: { categories } });
    } catch (err) {
      next(err);
    }
  }

  async getOne(req: Request, res: Response, next: NextFunction) {
    try {
      const category = await categoryService.getById(req.params.id);
      res.status(200).json({ status: 'success', data: { category } });
    } catch (err) {
      next(err);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const category = await categoryService.create(req.body);
      res.status(201).json({ status: 'success', message: 'Category created', data: { category } });
    } catch (err) {
      next(err);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const category = await categoryService.update(req.params.id, req.body);
      res.status(200).json({ status: 'success', message: 'Category updated', data: { category } });
    } catch (err) {
      next(err);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await categoryService.delete(req.params.id);
      res.status(200).json({ status: 'success', message: 'Category deleted' });
    } catch (err) {
      next(err);
    }
  }
}

export class StaffController {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { serviceId, isActive } = req.query;
      const staff = await staffService.getAll({
        serviceId: serviceId as string,
        isActive: isActive !== undefined ? isActive === 'true' : undefined,
      });
      res.status(200).json({ status: 'success', data: { staff } });
    } catch (err) {
      next(err);
    }
  }

  async getOne(req: Request, res: Response, next: NextFunction) {
    try {
      const staffMember = await staffService.getById(req.params.id);
      res.status(200).json({ status: 'success', data: { staff: staffMember } });
    } catch (err) {
      next(err);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const staffMember = await staffService.update(req.params.id, req.body);
      res.status(200).json({ status: 'success', message: 'Staff profile updated', data: { staff: staffMember } });
    } catch (err) {
      next(err);
    }
  }

  async setAvailability(req: Request, res: Response, next: NextFunction) {
    try {
      const availability = await staffService.setAvailability(req.params.id, req.body.schedules);
      res.status(200).json({ status: 'success', message: 'Availability schedule saved', data: { availability } });
    } catch (err) {
      next(err);
    }
  }
}

export const serviceController = new ServiceController();
export const categoryController = new CategoryController();
export const staffController = new StaffController();
