import * as yup from 'yup';

export const designSchema = yup.object().shape({
  name: yup.string().required('Design name is required'),
  ratePerUnit: yup
    .number()
    .typeError('Must be a number')
    .positive('Must be greater than 0')
    .required('Rate per unit is required'),
  ratePerMeter: yup
    .number()
    .typeError('Must be a number')
    .positive('Must be greater than 0')
    .required('Rate per meter is required'),
});

export type DesignFormData = yup.InferType<typeof designSchema>;
