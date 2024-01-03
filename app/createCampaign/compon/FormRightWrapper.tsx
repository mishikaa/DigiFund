'use client';

import React, { useContext, useState, FormEvent } from 'react';
import styled from 'styled-components';
import { crowdfundingCategories } from '@constants/categories';
import { FormState, FormContextProps } from '../page';
import { TailSpin } from 'react-loader-spinner';
import { toast } from 'react-toastify';
import axios from 'axios';


interface FormData {
  requiredAmount: number;
  category: string;
  description: string;
}


const FormRightWrapper: React.FC = () => {
  const [uploadLoading, setUploadLoading] = useState(false);
  
  const Handler = useContext<FormContextProps | undefined>(FormState);
  // Handling the case when Handler is undefined
  if (!Handler) {
    return null;
  }
  
  // Function to upload description and image to IPFS using Pinata API
  const uploadFiles = async (e: FormEvent) => {
    e.preventDefault();
    setUploadLoading(true);

    // For description
    if (Handler.formData.description !== "") {
      const formData = new FormData();
      const descriptionContent = Handler.formData.description;
      
      const blob = new Blob([descriptionContent], { type: 'text/plain' });
      formData.append('file', blob, 'description.txt');
      
      const pinataMetadata = JSON.stringify({
        name: 'description.txt',
      });
      formData.append('pinataMetadata', pinataMetadata);

      const pinataOptions = JSON.stringify({
        cidVersion: 0,
      });
      formData.append('pinataOptions', pinataOptions);
      
      try {
        const res = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_JWT}`,
          }
          });

          const hash = `https://fuchsia-advisory-narwhal-365.mypinata.cloud/ipfs/${res.data.IpfsHash}`;
          Handler.setDescriptionUrl(hash)
          // toast.success(`Successfully uploaded description`);
        } catch (error) {
          toast.warn(`Error uploading description ${error}`);
        }
      }
      
    // For image
    if (Handler.imageUrl !== null) {
      const formData = new FormData();
      const src = Handler.selectedImage;
      formData.append('file', src);

      const pinataMetadata = JSON.stringify({
        name: src.name,
      });
      formData.append('pinataMetadata', pinataMetadata);
      
      const pinataOptions = JSON.stringify({
        cidVersion: 0,
      })
      formData.append('pinataOptions', pinataOptions);
  
      try {
          const res = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
            headers: {
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_JWT}`,
            }
          });

          const hash = `https://fuchsia-advisory-narwhal-365.mypinata.cloud/ipfs/${res.data.IpfsHash}`;
          Handler.setImageUrl(hash)
          // toast.success(`Successfully uploaded image`);

      } catch (error) {
        toast.warn(`Error uploading image ${error}`);
      }
      
    }
    
    setUploadLoading(false);
    Handler.setUploaded(true);    
    toast.success("Files Uploaded Successfully");
    
  };

  
  return (
    <FormRight>
      <FormInput>
        <FormRow>
          <RowFirstInput>
            <label>Required Amount (In Matic)</label>
            <Input
              name="requiredAmount"
              type={'number'}
              placeholder='Required Amount'
              value={Handler.formData.requiredAmount}
              onChange={Handler.FormHandler}
            ></Input>
          </RowFirstInput>
          <RowSecondInput>
            <label>Choose Category</label>
            <Select
              name="category"
              value={Handler.formData.category}
              onChange={Handler.FormHandler}
            >
              <option value="" disabled>
                Select a category
              </option>
              {crowdfundingCategories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </Select>
          </RowSecondInput>
        </FormRow>
      </FormInput>
      {/* Image */}
      <FormInput>
        <label>Select Image</label>
        <Image
          alt="dapp"
          type='file'
          accept='image/*'
          onChange={Handler.ImageHandler}
        >
        </Image>
        {uploadLoading ? <Button><TailSpin color='#fff' height={20} /></Button> :
          Handler.uploaded === false ?
            <Button onClick={uploadFiles}>
              Upload Files to IPFS
            </Button>
            :
            <Button disabled={true}>
              Files uploaded Successfully
            </Button>
        }
        <Button onClick={Handler.startCampaign}>
          Start Campaign
        </Button>
      </FormInput>
    </FormRight>
  );
};

const FormInput = styled.div`
  display:flex ;
  flex-direction:column;
  font-family:'Source Sans 3', sans-serif;
  margin-top:10px ;
`;

const Input = styled.input`
  padding:15px;
  background-color:${(props) => props.theme.bgDiv} ;
  color:${(props) => props.theme.color} ;
  margin-top:4px;
  border:none ;
  border-radius:8px ;
  outline:none;
  font-size:large;
  width:100% ;
`;

const FormRight = styled.div`
  width:45%;
`;

const FormRow = styled.div`
  display: flex;
  justify-content:space-between;
  width:100% ;
`;

const RowFirstInput = styled.div`
  display:flex ;
  flex-direction:column ;
  width:45% ;
`;

const RowSecondInput = styled.div`
  display:flex ;
  flex-direction:column ;
  width:45% ;
`;

const Select = styled.select`
  padding:15px;
  background-color:${(props) => props.theme.bgDiv} ;
  color: ${(props) => (props.value ? props.theme.color : '#757575')};  margin-top:4px;
  border:none ;
  border-radius:8px ;
  outline:none;
  font-size:large;
  width:100% ;
`;

const Image = styled.input`
  background-color:${(props) => props.theme.bgDiv} ;
  color: ${(props) => (props.value ? props.theme.color : '#757575')};
  margin-top:4px;
  border:none ;
  border-radius:8px ;
  outline:none;
  font-size:large;
  width:100% ;

  &::-webkit-file-upload-button {
    padding: 15px ;
    background-color: ${(props) => props.theme.bgSubDiv} ;
    color: ${(props) => props.theme.color} ;
    outline:none ;
    border:none ;
    font-weight:bold ;
  }  
`;

const Button = styled.button`
  display: flex;
  justify-content:center;
  width:100% ;
  padding:15px ;
  color:white ;
  background-color:#00b712 ;
  background-image:
      linear-gradient(180deg, #00b712 0%, #5aff15 80%) ;
  border:none;
  margin-top:30px ;
  cursor: pointer;
  font-weight:bold ;
  font-size:large ;
`;

export default FormRightWrapper;