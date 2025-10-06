const Joi = require('joi');

const registerValidation = (data) => {
  const schema = Joi.object({
    username: Joi.string()
      .min(3)
      .max(30)
      .pattern(/^[a-zA-Z0-9_]+$/)
      .required()
      .messages({
        'string.pattern.base': 'Username can only contain letters, numbers, and underscores'
      }),
    email: Joi.string()
      .email()
      .required(),
    password: Joi.string()
      .min(6)
      .required(),
    confirmPassword: Joi.string()
      .valid(Joi.ref('password'))
      .required()
      .messages({
        'any.only': 'Passwords do not match'
      })
  });

  return schema.validate(data);
};

const loginValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string()
      .email()
      .required(),
    password: Joi.string()
      .required()
  });

  return schema.validate(data);
};

const taskValidation = (data) => {
  const schema = Joi.object({
    title: Joi.string()
      .max(100)
      .required(),
    description: Joi.string()
      .max(1000)
      .allow(''),
    priority: Joi.string()
      .valid('low', 'medium', 'high')
      .default('medium'),
    tags: Joi.array()
      .items(Joi.string().max(30))
      .default([]),
    dueDate: Joi.date()
      .greater('now')
      .allow(null),
    completed: Joi.boolean()
      .default(false),
    assignedTo: Joi.string()
      .pattern(/^[0-9a-fA-F]{24}$/)
      .allow(null)
  });

  return schema.validate(data);
};

const userUpdateValidation = (data) => {
  const schema = Joi.object({
    username: Joi.string().min(3).max(30).optional(),
    email: Joi.string().email().optional(),
    role: Joi.string().valid('user', 'admin').optional(), 
    isActive: Joi.boolean().optional() 
  });

  return schema.validate(data);
};

const adminUserUpdateValidation = (data) => {
  const schema = Joi.object({
    username: Joi.string().min(3).max(30).optional(),
    email: Joi.string().email().optional(),
    role: Joi.string().valid('user', 'admin').optional(),
    isActive: Joi.boolean().optional(),
    password: Joi.string().min(6).optional()
  });

  return schema.validate(data);
};
module.exports = {
  registerValidation,
  loginValidation,
  taskValidation,
  userUpdateValidation,
  adminUserUpdateValidation
};