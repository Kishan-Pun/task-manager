import Task from "./task.model.js";

// CREATE TASK
export const createTask = async (req, res, next) => {
  try {
    const { title, description } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const task = await Task.create({
      title,
      description,
      userId: req.user._id
    });

    res.status(201).json({
      message: "Task created",
      task
    });
  } catch (error) {
    next(error);
  }
};

// GET TASKS (Search + Filter)
export const getTasks = async (req, res, next) => {
  try {
    const { search, status } = req.query;

    const query = { userId: req.user._id };

    if (status) {
      query.status = status;
    }

    if (search) {
      query.title = { $regex: search, $options: "i" };
    }

    const tasks = await Task.find(query).sort({ createdAt: -1 });

    res.json(tasks);
  } catch (error) {
    next(error);
  }
};

// UPDATE TASK
export const updateTask = async (req, res, next) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    task.title = req.body.title ?? task.title;
    task.description = req.body.description ?? task.description;
    task.status = req.body.status ?? task.status;

    await task.save();

    res.json({
      message: "Task updated",
      task
    });
  } catch (error) {
    next(error);
  }
};

// DELETE TASK
export const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json({ message: "Task deleted" });
  } catch (error) {
    next(error);
  }
};
