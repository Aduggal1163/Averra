import Poll from "../models/Poll.model.js";
export const createPoll=async(req,res)=>{
    try {
        const {question,options,expiresAt}=req.body;
        if(req.user.role !== 'admin')
        {
            return res.status(403).json({
                message:"Only admin can create polls"
            })
        }
        if (!question || !options || options.length < 2) {
            return res.status(400).json({ message: "Poll must have a question and at least 2 options" });
    }
     // Format options to include vote count (optional)
    const formattedOptions = options.map(opt => ({
      text: opt,
      votes: 0
    }));
    const poll= await Poll.create({
        question,
        options:formattedOptions,
        createdBy:req.user.id,
        expiresAt
    })
    return res.status(201).json({
        message:"Poll created Successfully"
    })
    } catch (error) {
        console.error("Create Poll Error:", error);
    res.status(500).json({ message: "Internal server error" });
    }
}
export const votePoll = async (req, res) => {
  try {
    const { pollId } = req.params;
    const { selectedOption } = req.body;
    const userId = req.user.id;

    // Only resident or guard can vote
    if (!['resident', 'guard'].includes(req.user.role)) {
      return res.status(403).json({
        message: "You are not allowed to vote",
      });
    }

    if (!selectedOption) {
      return res.status(400).json({
        message: "Selected option is required"
      });
    }

    const poll = await Poll.findById(pollId);
    if (!poll) {
      return res.status(404).json({ message: "Poll not found" });
    }

    if (poll.expiresAt && new Date(poll.expiresAt) < new Date()) {
      return res.status(400).json({ message: "Poll has expired" });
    }

    const alreadyVoted = poll.votes.find(vote => vote.user.toString() === userId);
    if (alreadyVoted) {
      return res.status(403).json({ message: "You have already voted in this poll" });
    }

    const optionIndex = poll.options.findIndex(opt => opt.text === selectedOption);
    if (optionIndex === -1) {
      return res.status(400).json({ message: "Invalid option selected" });
    }

    // Increment vote count
    poll.options[optionIndex].votes += 1;

    // Register vote
    poll.votes.push({ user: userId, option: selectedOption });

    await poll.save();

    return res.status(200).json({ message: "Vote recorded successfully" });

  } catch (error) {
    console.error("Vote Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllPolls = async (req, res) => {
  try {
    const polls = await Poll.find().sort({ createdAt: -1 });
    res.status(200).json({ message: "Polls fetched", polls });
  } catch (error) {
    console.error("Get Polls Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// . Get Poll by ID with Results Summary
export const getPollById = async (req, res) => {
  try {
    const { pollId } = req.params;

    const poll = await Poll.findById(pollId);
    if (!poll) {
      return res.status(404).json({ message: "Poll not found" });
    }

    const totalVotes = poll.options.reduce((sum, opt) => sum + opt.votes, 0);
    const results = poll.options.map(opt => ({
      text: opt.text,
      votes: opt.votes,
      percentage: totalVotes > 0 ? ((opt.votes / totalVotes) * 100).toFixed(2) : '0.00'
    }));

    res.status(200).json({
      question: poll.question,
      expiresAt: poll.expiresAt,
      results,
      totalVotes
    });

  } catch (error) {
    console.error("Get Poll By ID Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
// Delete Poll (Admin Only)
export const deletePoll = async (req, res) => {
  try {
    const { pollId } = req.params;
    const user = req.user;

    if (user.role !== 'admin') {
      return res.status(403).json({ message: "Only admin can delete polls" });
    }

    const deleted = await Poll.findByIdAndDelete(pollId);
    if (!deleted) {
      return res.status(404).json({ message: "Poll not found" });
    }

    res.status(200).json({ message: "Poll deleted successfully" });

  } catch (error) {
    console.error("Delete Poll Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
// Get Only Active Polls (Not Expired)
export const getActivePolls = async (req, res) => {
  try {
    const currentDate = new Date();
    const activePolls = await Poll.find({ expiresAt: { $gt: currentDate } }).sort({ createdAt: -1 });

    res.status(200).json({
      message: "Active polls fetched successfully",
      polls: activePolls
    });

  } catch (error) {
    console.error("Get Active Polls Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
// Poll Analytics (Admin Only)
export const getPollAnalytics = async (req, res) => {
  try {
    const { pollId } = req.params;

    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: "Only admin can access analytics" });
    }

    const poll = await Poll.findById(pollId);
    if (!poll) {
      return res.status(404).json({ message: "Poll not found" });
    }

    const totalVotes = poll.options.reduce((sum, opt) => sum + opt.votes, 0);
    const analytics = poll.options.map(opt => ({
      option: opt.text,
      votes: opt.votes,
      percentage: totalVotes > 0 ? ((opt.votes / totalVotes) * 100).toFixed(2) : '0.00'
    }));

    res.status(200).json({
      pollId: poll._id,
      question: poll.question,
      totalVotes,
      analytics
    });

  } catch (error) {
    console.error("Poll Analytics Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
