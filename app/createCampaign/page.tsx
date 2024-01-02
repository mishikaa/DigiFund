'use client';

import React, { createContext, useState } from 'react';
import styled from 'styled-components';
import FormLeftWrapper from './compon/FormLeftWrapper';
import FormRightWrapper from './compon/FormRightWrapper';
import { toast } from 'react-toastify';
import { ethers } from 'ethers';
import CampaignFactory from '@artifacts/contracts/campaign.sol/CampaignFactory.json';
import { TailSpin } from 'react-loader-spinner';
import Link from 'next/link';

interface CreateCampaignFormProps {
  onSubmit: (data: CampaignFormData) => void;
}

interface CampaignFormData {
  campaignTitle: string;
  description: string;
  requiredAmount: string;
  category: string;
}

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

declare global {
  interface Window {
    ethereum?: any; // This will allow 'ethereum' on the window object
  }
}

const FormState = createContext<FormContextProps | undefined>(undefined);

const CreateCampaign: React.FC<CreateCampaignFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<CampaignFormData>({
    campaignTitle: '',
    description: '',
    requiredAmount: '0',
    category: ''
  });
  const [selectedImage, setSelectedImage] = useState<File>();
  const [descriptionUrl, setDescriptionUrl] = useState();
  const [imageUrl, setImageUrl] = useState('');
  const [uploaded, setUploaded] = useState(false);
  const [address, setAddress] = useState('')
  const [loading, setLoading] = useState(false)

  const ImageHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if(file)
      setSelectedImage(file);
  };
  
  const FormHandler = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const startCampaign = async(e:Event) => {
    e.preventDefault();
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();

    if(!formData.campaignTitle || !formData.description || !formData.requiredAmount || !formData.category) {
      toast.warn("Enter details in all the required fields")
      return;
    } else if(!uploaded) {
      toast.warn("Upload Files required.")
      return;
    }
    
    try {
      setLoading(true);
      const contractAddress = process.env.NEXT_PUBLIC_ADDRESS;
      if (!contractAddress) {
        console.error("NEXT_PUBLIC_ADDRESS environment variable is not defined");
      } else {
        const contract = new ethers.Contract(
          contractAddress,
          CampaignFactory.abi,
          signer       
        );
  
        const campaignData = await contract.createCampaign(
          formData.campaignTitle,
          ethers.parseEther(formData.requiredAmount),
          imageUrl,
          formData.category,
          descriptionUrl
        )

        console.log("Campaign data:", campaignData);
        await campaignData.wait();
        setAddress(campaignData.to);
      }
    } catch (error) {
      toast.error(`Failed to Start Campaign. ${error}`)
    }
    
  }

  const contextValue: FormContextProps = {
    formData, 
    setFormData, 
    selectedImage,
    FormHandler, 
    ImageHandler, 
    imageUrl, 
    setImageUrl, 
    descriptionUrl,
    setDescriptionUrl,
    startCampaign,
    uploaded,
    setUploaded
  };

  return (
    <FormState.Provider value={contextValue}>
      <FormWrapper>
          {loading ? 
          address == '' ?
          <Spinner>
            <TailSpin height = {160} />
          </Spinner>
            : 
            <Address>
              <h1>Campaign Started Successfully</h1>
              <h1>{address}</h1>
              <Button><Link href='/'>Go to Campaign</Link></Button>
            </Address> :
            <FormInputsWrapper>
                <FormLeftWrapper />
                <FormRightWrapper />
            </FormInputsWrapper>
          }
      </FormWrapper>
    </FormState.Provider>
  );
};

const FormWrapper = styled.form`
  width: 100%;
  display:flex;
  gap: 8px;
  justify-content:center;
  margin: auto;
`;

const FormInputsWrapper = styled.div`
    width: 80%;
    display:flex;
    justify-content:space-between ;
    margin-top:45px ;
`

const Spinner = styled.div`
  width: 100%;
  height: 80vh;
  display: flex;
  justify-content: center;
  align-items: center;
`
const Address = styled.div`
  width: 100%;
  height: 80vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: ${(props) => props.theme.bgSubDiv};
  border-radius: 12px;
  margin: 0 8%;
`
const Button = styled.button`
  display: flex;
  justify-content:center;
  width:50% ;
  padding:15px ;
  color:white ;
  background-color:#00b712 ;
  background-image: linear-gradient(180deg, #00b712 0%, #5aff15 80%) ;
  border:none;
  margin-top:30px ;
  cursor: pointer;
  font-weight:bold ;
  font-size:large ;
`;

export default CreateCampaign;
export {FormState};
export type {FormContextProps} ;