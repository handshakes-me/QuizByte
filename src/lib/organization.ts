import organizationModel from "@/models/organization.model";
import { getUserFromCookies } from "./userAuth";
import { USERROLE } from "./utils";
import dbConnect from "@/config/dbConnect";
import { Organization } from "@/components/organizations/OrganizationDataTable";

export const getOrganizations = async (): Promise<Organization[] | null> => {
    try {

        await dbConnect();
        const decode = await getUserFromCookies(USERROLE.SUPERADMIN)
        if (!decode) return null;

        const organizations = await organizationModel.find({});

        return organizations;
    } catch (e) {
        console.log("Error while fetching organizations : ", e);
        return null;
    }
}