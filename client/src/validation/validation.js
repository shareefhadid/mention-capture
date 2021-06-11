const Joi = require("joi");
const { tldSet } = require("@/validation/tlds.js");

const registerValidation = (data) => {
  const schema = Joi.object({
    name: Joi.string()
      .alphanum()
      .min(3)
      .max(30)
      .required().messages({
        "string.base": `Username should be a string`,
        "string.empty": `Username cannot be left empty`,
        "string.min": `Username should be at least {#limit} characters`,
        "string.max": `Username should be under {#limit} characters`,
        "any.required": `Username is a required field`,
        "string.pattern.base": `Username can only contain numbers, letters, spaces, or underscores`,
      }),
    password: Joi.string()
      .min(6)
      .required().messages({
        "string.base": `Password should be a string`,
        "string.empty": `Password cannot be left empty`,
        "string.min": `Password should be at least {#limit} characters`,
        "string.max": `Password should be under {#limit} characters`,
        "any.required": `Password is a required field`,
        "string.pattern.base": `Password can only contain numbers, letters, spaces, or underscores`,
      }),
    confirmPassword: Joi.any()
      .equal(Joi.ref('password'))
      .required()
      .messages({ 'any.only': 'Password does not match', "any.required": `You must confirm your password` }),
    passcode: Joi.string().required().messages({
      "string.base": `Passcode should be a string`,
      "string.empty": `Passcode cannot be left empty`,
      "string.min": `Passcode should be at least {#limit} characters`,
      "string.max": `Passcode should be under {#limit} characters`,
      "any.required": `Passcode is a required field`,
      "string.pattern.base": `Passcode can only contain numbers, letters, spaces, or underscores`,
    }),
  });
  return schema.validate(data, {
    abortEarly: false,
    errors: { label: "key", escapeHtml: true },
  });
};

const loginValidation = (data) => {
  const schema = Joi.object({
    name: Joi.string()
      .alphanum()
      .min(3)
      .max(30)
      .required().messages({
        "string.base": `Username should be a string`,
        "string.empty": `Username cannot be left empty`,
        "string.min": `Username should be at least {#limit} characters`,
        "string.max": `Username should be under {#limit} characters`,
        "any.required": `Username is a required field`,
        "string.pattern.base": `Username can only contain numbers, letters, spaces, or underscores`,
      }),
    password: Joi.string()
      .min(6)
      .required().messages({
        "string.base": `Password should be a string`,
        "string.empty": `Password cannot be left empty`,
        "string.min": `Password should be at least {#limit} characters`,
        "string.max": `Password should be under {#limit} characters`,
        "any.required": `Password is a required field`,
        "string.pattern.base": `Password can only contain numbers, letters, spaces, or underscores`,
      }),
  });
  return schema.validate(data, {
    abortEarly: false,
    errors: { label: "key", escapeHtml: true },
  });
};

const searchValidation = (data) => {
  const schema = Joi.object({
    _id: Joi.string(),
    search_name: Joi.string()
      .pattern(/^[\w\s]+$/)
      .min(3)
      .max(40)
      .required()
      .messages({
        "string.base": `Search name should be a string`,
        "string.empty": `Search name cannot be left empty`,
        "string.min": `Search name should be at least {#limit} characters`,
        "string.max": `Search name should be under {#limit} characters`,
        "any.required": `Search name is a required field`,
        "string.pattern.base": `Search name can only contain numbers, letters, spaces, or underscores`,
      }),
    search_terms: Joi.array()
      .items(
        Joi.string()
          .min(1)
          .max(50)
          .messages({
            "string.base": `Search term should be a string`,
            "string.empty": `Search term cannot be left empty`,
            "string.min": `Search term should be at least {#limit} characters`,
            "string.max": `Search term should be under {#limit} characters`,
          }),
        Joi.string()
          .pattern(/[<>]/)
          .forbidden()
      )
      .max(100)
      .messages({
        "array.excludes": `Search terms cannot contain '<' or '>'`,
      }),
    sources: Joi.array()
      .items(
        Joi.object().keys({
          source_name: Joi.string()
            .pattern(/^[\w\s]+$/)
            .min(1)
            .max(40)
            .required()
            .messages({
              "string.base": `Source name should be a string`,
              "string.empty": `Source name cannot be left empty`,
              "string.min": `Source name should be at least {#limit} characters`,
              "string.max": `Source name should be under {#limit} characters`,
              "any.required": `Source name is a required field`,
              "string.pattern.base": `Source name can only contain numbers, letters, spaces, or underscores`,
            }),
          source_url: Joi.string()
            .uri()
            .required()
            .messages({
              "any.required": `RSS is a required field`,
              "string.empty": `RSS cannot be left empty`,
              "string.uri": `RSS must be a valid URI and include a scheme (i.e. 'https://', 'http://', or 'feed://')`,
            }),
        })
      )
      .min(1)
      .max(50)
      .required()
      .messages({
        "array.max": `A search can have no more than {#limit} sources`,
        "array.min": `A search must have at least {#limit} source`,
      }),
  });
  return schema.validate(data, {
    abortEarly: false,
    errors: { label: "key", escapeHtml: true },
  });
};

const sourceValidation = (data) => {
  const schema = Joi.object({
    source_name: Joi.string()
      .pattern(/^[\w\s]+$/)
      .min(1)
      .max(40)
      .required()
      .messages({
        "string.base": `Source name should be a string`,
        "string.empty": `Source name cannot be left empty`,
        "string.min": `Source name should be at least {#limit} characters`,
        "string.max": `Source name should be under {#limit} characters`,
        "any.required": `Source name is a required field`,
        "string.pattern.base": `Source name can only contain numbers, letters, spaces, or underscores`,
      }),
    source_url: Joi.string()
      .uri()
      .required()
      .messages({
        "any.required": `RSS is a required field`,
        "string.empty": `RSS cannot be left empty`,
        "string.uri": `RSS must be a valid URI and include a scheme (i.e. 'https://', 'http://', or 'feed://')`,
      }),
  });
  return schema.validate(data, {
    abortEarly: false,
    errors: { label: "key", escapeHtml: true },
  });
};

const newsletterValidation = (data) => {
  const schema = Joi.object({
    _id: Joi.string(),
    name: Joi.string()
      .pattern(/^[\w\s]+$/)
      .min(3)
      .max(40)
      .required()
      .messages({
        "string.base": `Newsletter name should be a string`,
        "string.empty": `Newsletter name cannot be left empty`,
        "string.min": `Newsletter name should be at least {#limit} characters`,
        "string.max": `Newsletter name should be under {#limit} characters`,
        "any.required": `Newsletter name is a required field`,
        "string.pattern.base": `Newsletter name can only contain numbers, letters, spaces, or underscores`,
      }),
    title: Joi.string()
      .pattern(/^[\w\s]+$/)
      .min(1)
      .max(40)
      .required()
      .messages({
        "string.base": `Newsletter title should be a string`,
        "string.empty": `Newsletter title cannot be left empty`,
        "string.min": `Newsletter title should be at least {#limit} characters`,
        "string.max": `Newsletter title should be under {#limit} characters`,
        "any.required": `Newsletter title is a required field`,
        "string.pattern.base": `Newsletter title can only contain numbers, letters, spaces, or underscores`,
      }),
    emails: Joi.array()
      .items(
        Joi.string()
          .email({ tlds: { allow: tldSet } })
          .messages({
            "string.base": `Email should be a string`,
            "string.empty": `Email cannot be left empty`,
            "string.email": `One or more emails are invalid`,
          })
      )
      .min(1)
      .max(100)
      .required()
      .messages({
        "array.max": `A newsletter can have no more than {#limit} emails`,
        "array.min": `A newsletter must have at least {#limit} email`,
      }),
    searches: Joi.array()
      .items(
        Joi.string()
          .pattern(/^[\w\s]+$/)
          .messages({
            "string.base": `Search should be a string`,
            "string.pattern.base": `Search can only contain numbers, letters, spaces, or underscores`,
          })
      )
      .min(1)
      .required()
      .messages({
        "array.min": `A newsletter must have at least {#limit} search`,
      }),
    max_results: Joi.number()
      .min(1)
      .max(20)
      .required()
      .messages({
        "number.base": `Max results should be a number`,
        "number.empty": `Max results cannot be left empty`,
        "number.min": `Max results should be at least {#limit}`,
        "number.max": `Max results should be under {#limit}`,
        "any.required": `Max results is a required field`,
      }),
    min_results: Joi.number()
      .min(1)
      .max(20)
      .required()
      .messages({
        "number.base": `Min results should be a number`,
        "number.empty": `Min results cannot be left empty`,
        "number.min": `Min results should be at least {#limit}`,
        "number.max": `Min results should be under {#limit}`,
        "any.required": `Min results is a required field`,
      }),
    interval: Joi.string()
      .required()
      .messages({
        "string.base": `Interval should be a string`,
      }),
    start_date: Joi.date()
      .iso()
      .required()
      .messages({
        "date.base": `Start date should be a date`,
        "date.format": `Start date should be in this format (i.e. '28.04.2021 10:43 AM)'`,
      }),
    active: Joi.boolean().required(),
  });
  return schema.validate(data, {
    abortEarly: false,
    errors: { label: "key", escapeHtml: true },
  });
};

const testNewsletterValidation = (data) => {
  const schema = Joi.object({
    title: Joi.string()
      .pattern(/^[\w\s]+$/)
      .min(1)
      .max(40)
      .required()
      .messages({
        "string.base": `Newsletter title should be a string`,
        "string.empty": `Newsletter title cannot be left empty`,
        "string.min": `Newsletter title should be at least {#limit} characters`,
        "string.max": `Newsletter title should be under {#limit} characters`,
        "any.required": `Newsletter title is a required field`,
        "string.pattern.base": `Newsletter title can only contain numbers, letters, spaces, or underscores`,
      }),
    testEmails: Joi.array()
      .items(
        Joi.string()
          .email({ tlds: { allow: tldSet } })
          .messages({
            "string.base": `Email should be a string`,
            "string.empty": `Email cannot be left empty`,
            "string.email": `One or more emails are invalid`,
          })
      )
      .min(1)
      .max(10)
      .messages({
        "array.max": `A test newsletter can have no more than {#limit} emails`,
        "array.min": `A test newsletter must have at least {#limit} email`,
      }),
    searches: Joi.array()
      .items(
        Joi.string()
          .pattern(/^[\w\s]+$/)
          .required()
          .messages({
            "string.base": `Search should be a string`,
            "string.pattern.base": `Search can only contain numbers, letters, spaces, or underscores`,
          })
      )
      .min(1)
      .messages({
        "array.min": `A newsletter must have at least {#limit} search`,
      }),
    max_results: Joi.number()
      .min(1)
      .max(20)
      .messages({
        "number.base": `Max results should be a number`,
        "number.empty": `Max results cannot be left empty`,
        "number.min": `Max results should be at least {#limit}`,
        "number.max": `Max results should be under {#limit}`,
        "any.required": `Max results is a required field`,
      }),
  });
  return schema.validate(data, {
    abortEarly: false,
    errors: { label: "key", escapeHtml: true },
  });
};

// exporting this way allows us to access the functions directly. See /routes/auth.js
module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
module.exports.searchValidation = searchValidation;
module.exports.sourceValidation = sourceValidation;
module.exports.newsletterValidation = newsletterValidation;
module.exports.testNewsletterValidation = testNewsletterValidation;
