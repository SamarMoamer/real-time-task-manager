const generatePagination = (page, limit, total) => {
  const totalPages = Math.ceil(total / limit);
  const hasNext = page < totalPages;
  const hasPrev = page > 1;

  return {
    currentPage: page,
    totalPages,
    totalItems: total,
    hasNext,
    hasPrev,
    nextPage: hasNext ? page + 1 : null,
    prevPage: hasPrev ? page - 1 : null
  };
};

const buildTaskSearchQuery = (userId, filters) => {
  const query = { createdBy: userId };

  // Text search
  if (filters.search) {
    query.$text = { $search: filters.search };
  }

  // Priority filter
  if (filters.priority && filters.priority !== 'all') {
    query.priority = filters.priority;
  }

  // Tags filter
  if (filters.tags && filters.tags.length > 0) {
    query.tags = { $in: filters.tags };
  }

  // Completion status filter
  if (filters.completed !== undefined) {
    query.completed = filters.completed === 'true';
  }

  // Due date filters
  if (filters.dueDate) {
    const now = new Date();
    switch (filters.dueDate) {
      case 'today':
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        query.dueDate = { $gte: now, $lt: tomorrow };
        break;
      case 'week':
        const nextWeek = new Date(now);
        nextWeek.setDate(nextWeek.getDate() + 7);
        query.dueDate = { $gte: now, $lt: nextWeek };
        break;
      case 'overdue':
        query.dueDate = { $lt: now };
        query.completed = false;
        break;
    }
  }

  return query;
};

const buildTaskSortOptions = (sortBy = 'createdAt', order = 'desc') => {
  const sortOptions = {};
  const validSortFields = ['title', 'priority', 'dueDate', 'createdAt', 'completedAt'];
  const validOrders = ['asc', 'desc'];

  const sortField = validSortFields.includes(sortBy) ? sortBy : 'createdAt';
  const sortOrder = validOrders.includes(order) ? order : 'desc';

  sortOptions[sortField] = sortOrder === 'desc' ? -1 : 1;

  // Secondary sort for consistent ordering
  if (sortField !== 'createdAt') {
    sortOptions.createdAt = -1;
  }

  return sortOptions;
};

const sanitizeUserInput = (input) => {
  if (typeof input === 'string') {
    return input.trim().replace(/[<>]/g, '');
  }
  return input;
};

const formatActivityMessage = (activity) => {
  const messages = {
    create: `created task "${activity.details.task}"`,
    update: `updated task "${activity.details.task}"`,
    delete: `deleted task "${activity.details.task}"`,
    complete: `marked task "${activity.details.task}" as completed`,
    assign: `assigned task "${activity.details.task}" to ${activity.details.assignedTo}`
  };

  return messages[activity.type] || `performed action on task "${activity.details.task}"`;
};

module.exports = {
  generatePagination,
  buildTaskSearchQuery,
  buildTaskSortOptions,
  sanitizeUserInput,
  formatActivityMessage
};