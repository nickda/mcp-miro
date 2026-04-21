import MiroClient from '../client.js';
import { z } from 'zod';
import { ServerResponse } from '../server-response.js';
import { ToolSchema } from '../tool.js';

const getItemsOnBoardTool: ToolSchema = {
  name: "get-items-on-board",
  description: "Retrieve all items on a specific Miro board. Uses cursor-based pagination.",
  args: {
    boardId: z.string().describe("Unique identifier (ID) of the board whose items you want to retrieve"),
    limit: z.number().optional().nullish().describe("Maximum number of items to return (default: 50)"),
    cursor: z.string().optional().nullish().describe("Cursor for pagination (from previous response)"),
    type: z.enum(["text", "shape", "sticky_note", "image", "document", "card", "app_card", "preview", "frame", "embed"]).optional().nullish().describe("Filter items by type")
  },
  fn: async ({ boardId, limit = 50, cursor, type }) => {
    try {
      if (!boardId) {
        return ServerResponse.error("Board ID is required");
      }

      const params: Record<string, string> = {
        limit: String(limit),
      };
      if (cursor) params.cursor = cursor;
      if (type) params.type = type;

      const itemsData = await MiroClient.getApi().getItems(boardId, params);

      return ServerResponse.text(JSON.stringify(itemsData, null, 2));
    } catch (error) {
      return ServerResponse.error(error);
    }
  }
}

export default getItemsOnBoardTool;