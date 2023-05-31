const express = require("express");
const passport = require("passport");
const router = express.Router();
const User = require("../models/User");

// To be used as the login button link
router.get(
    "/signin",
    passport.authenticate(
        "google",
        {
            prompt: "select_account",
            scope: ["profile", "email"]
        }
    )
);

// Send get request to logout
router.get(
    "/signout",
    (req, res) => {
        req.logout();
        res.redirect(process.env.FRONTEND);
    }
);

// Send get request to check if user is logged in
router.get(
    "/check",
    async (req, res) => {
        if (!req.isAuthenticated()) {
            res.send({ isLoggedIn: false });
            return;
        }
        const data = await User.getData(req.user.email)
        res.send({ isLoggedIn: true, data: data });
    }
);

// For google redirection handling
router.get(
    "/google/callback",
    passport.authenticate("google", { failureRedirect: process.env.FRONTEND }),
    (req, res) => {
        res.redirect(process.env.FRONTEND);
    }
);

// Update the expenses data for the user
router.post(
    "/update",
    async (req, res) => {
        if (req.isAuthenticated()) {
            await User.update(req.user.email, req.body);
            res.send();
        }
        else res.sendStatus(401);
    }
);

module.exports = router;