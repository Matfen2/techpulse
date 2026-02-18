import Joi from 'joi';

export const signupSchema = Joi.object({
  firstName: Joi.string().trim().min(2).max(50).required()
    .messages({ 'string.empty': 'Le prénom est requis' }),
  lastName: Joi.string().trim().min(2).max(50).required()
    .messages({ 'string.empty': 'Le nom est requis' }),
  email: Joi.string().email().lowercase().trim().required()
    .messages({ 'string.email': 'Email invalide' }),
  password: Joi.string().min(8).required()
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .messages({
      'string.min': 'Le mot de passe doit contenir au moins 8 caractères',
      'string.pattern.base': 'Le mot de passe doit contenir une majuscule, une minuscule et un chiffre',
    }),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().lowercase().trim().required(),
  password: Joi.string().required(),
});