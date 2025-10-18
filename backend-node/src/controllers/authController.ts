export const getMe = async (req: any, res: any) => {
    res.status(200).json({authenticated: true, user: req.session.user});
};
