import organizationModel from "@/models/organization.model";
import { getUserFromCookies } from "./userAuth";
import { USERROLE } from "./utils";
import dbConnect from "@/config/dbConnect";
import { Organization } from "@/components/organizations/OrganizationDataTable";
import adminModel from "@/models/admin.model";

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

export const getOrganizationData = async (): Promise<Organization | null> => {
    try {

        await dbConnect();
        const decode = await getUserFromCookies(USERROLE.ADMIN)
        if (!decode) return null;

        const user = await adminModel.findById(decode?.id);
        if(!user) {
            return null;
        }

        const organization = await organizationModel.findOne(user?.organizationId);

        return organization;
    } catch (e) {
        console.log("Error while fetching organizations : ", e);
        return null;
    }
}