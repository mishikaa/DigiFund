// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

contract CampaignFactory {
    address[] public deployedCampaigns;

    event campaignCreated(
        string title, 
        uint requiredAmount, 
        address indexed owner, 
        address campaignAddress, 
        string imgURL, 
        string desc,
        uint indexed timestamp, 
        string indexed category
    );

    function createCampaign(
        string memory campaignTitle, 
        uint requiredCampaignAmount, 
        string memory imgURL, 
        string memory category, 
        string memory desc
    ) public {
        Campaign newCampaign = new Campaign(
            campaignTitle, 
            requiredCampaignAmount, 
            imgURL,
            desc,
            msg.sender,
            category
        );
        deployedCampaigns.push(address(newCampaign));

        emit campaignCreated(
            campaignTitle, 
            requiredCampaignAmount, 
            msg.sender, 
            address(newCampaign), 
            imgURL, 
            desc,
            block.timestamp, 
            category
        );
    }
}

contract Campaign {
    struct CampDetails {
        string title;
        uint requiredAmount;
        uint receivedAmount;
        string image;
        string desc;
        string category;
        address payable owner;
    }

    CampDetails public campaignDetails;

    event donated(address indexed donor, uint indexed amount, uint indexed timestamp);

    constructor(string memory _title, uint _reqAmount, 
    string memory _image, string memory _desc, address campaignOwner, string memory _category) 
    {
        campaignDetails.title = _title;
        campaignDetails.image = _image;
        campaignDetails.requiredAmount = _reqAmount;
        campaignDetails.desc = _desc;
        campaignDetails.owner = payable(campaignOwner);
        campaignDetails.category = _category;
    }

    function donate() public payable {
        require(campaignDetails.requiredAmount > campaignDetails.receivedAmount, "required amount fulfilled");
        
        address payable owner = campaignDetails.owner;

        owner.transfer(msg.value);
        campaignDetails.receivedAmount += msg.value;
        emit donated(msg.sender, msg.value, block.timestamp);

        campaignDetails.requiredAmount -= msg.value;
    }
}