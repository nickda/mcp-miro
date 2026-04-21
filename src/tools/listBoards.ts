import MiroClient from '../client.js';
import { z } from 'zod';
import { ServerResponse } from '../server-response.js';
import { ToolSchema } from '../tool.js';

const listBoardsTool: ToolSchema = {
  name: "list-boards",
  description: "List all available Miro boards. Supports pagination, search by name/description, and sorting.",
  args: {
    limit: z.number().optional().nullish().describe("Maximum number of boards to return (default: 50, max: 50)"),
    offset: z.number().optional().nullish().describe("Offset for pagination (default: 0)"),
    query: z.string().optional().nullish().describe("Search boards by name or description"),
    sort: z.enum(["default", "last_modified", "last_opened", "last_created", "alphabetically"]).optional().nullish().describe("Sort order for results")
  },
  fn: async ({ limit = 50, offset = 0, query, sort }) => {
    try {
      const params: Record<string, string> = {
        limit: String(limit),
        offset: String(offset),
      };
      if (query) params.query = query;
      if (sort) params.sort = sort;

      const boardsData = await MiroClient.getApi().getBoards(params);

      return ServerResponse.text(JSON.stringify(boardsData, null, 2))
    } catch (error) {
      process.stderr.write(`Error fetching Miro boards: ${error}\n`);

      return ServerResponse.error(error)
    }
  }
}

export default listBoardsTool;