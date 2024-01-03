import React, { createContext, useState } from 'react';

interface FormContextProps {
  formData: any;
  setFormData: any;
  selectedImage: any;
  FormHandler: any;
  ImageHandler: any;
  imageUrl: string | null;
  setImageUrl: (url: string) => void;
  descriptionUrl: any;
  setDescriptionUrl: any;
  startCampaign: any;
  uploaded: any;
  setUploaded: any;
}

const FormState = createContext<FormContextProps | undefined>(undefined);

export { FormState };
export type { FormContextProps };
