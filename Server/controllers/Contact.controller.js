import express from 'express';
import Contact from '../models/Contact.model.js';
export const getfeedback=async(req,res)=>{
    try {
        const {name, email, phone, feedback, ratings}= req.body;
        if(!name || !email || !phone || !feedback ||! ratings)
        {
            return res.status(400).json({
                message: "Please fill all the fields",
            })
        }
        if(feedback<=0 || feedback>5) 
        {
            return res.status(400).json({
                message: "Please enter a valid rating",
            })
        }
        const feedbacks=await Contact.create({
            name, email, phone, feedback, ratings
        })
        return res.status(201).json({
            message: "Feedback submitted successfully",
            feedbacks
        })
    } catch (error) {
        return res.status(500).json({
            message: "Error submitting feedback",
            })
    }
}