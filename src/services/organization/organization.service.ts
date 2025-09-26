import { UtilsService } from "../utils";
import { authorizedAPI } from "@/config/axios.config";
import type { Position, PositionFormData } from "@/types";

const utils = new UtilsService();

class OrganizationService {
  // POST /api/v1/organization - Create a new organization position
  createPosition(formData: PositionFormData): Promise<Position> {
    return utils.handleApiRequest(() => {
      // Remove superiorId from request body if it's null
      const { superiorId, ...requestData } = formData;
      const payload = superiorId === null ? requestData : formData;
      return authorizedAPI.post("/organization", payload);
    });
  }

  // GET /api/v1/organization - Get all organization positions
  getAllPositions(): Promise<Position[]> {
    return utils.handleApiRequest(() => {
      return authorizedAPI.get("/organization");
    });
  }

  // GET /api/v1/organization/tree - Get organization tree (all positions)
  getOrganizationTreeAll(): Promise<Position[]> {
    return utils.handleApiRequest(() =>
      authorizedAPI.get("/organization/tree")
    );
  }

  // GET /api/v1/organization/tree/{userId} - Get organization tree for specific user
  getOrganizationTreeByUser(userId: string): Promise<Position> {
    return utils.handleApiRequest(() =>
      authorizedAPI.get(`/organization/tree/${userId}`)
    );
  }

  // GET /api/v1/organization/{id} - Get specific organization position by ID
  getPositionById(id: string): Promise<Position> {
    return utils.handleApiRequest(() =>
      authorizedAPI.get(`/organization/${id}`)
    );
  }

  // PATCH /api/v1/organization/{id} - Update organization position
  updatePosition(id: string, formData: PositionFormData): Promise<Position> {
    return utils.handleApiRequest(() => {
      // Remove superiorId from request body if it's null
      const { superiorId, ...requestData } = formData;
      const payload = superiorId === null ? requestData : formData;
      return authorizedAPI.patch(`/organization/${id}`, payload);
    });
  }

  // DELETE /api/v1/organization/{id} - Delete organization position
  deletePosition(id: string): Promise<void> {
    return utils.handleApiRequest(() =>
      authorizedAPI.delete(`/organization/${id}`)
    );
  }

  // GET /api/v1/organization/{id}/subordinates - Get subordinates for a specific position
  getSubordinates(id: string): Promise<Position[]> {
    return utils.handleApiRequest(() =>
      authorizedAPI.get(`/organization/${id}/subordinates`)
    );
  }
}

export const organizationService = new OrganizationService();
