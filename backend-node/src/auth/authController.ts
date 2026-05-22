export const getMe = async (req: any, res: any) => {
  res.setHeader(
    'Cache-Control',
    'no-store, no-cache, must-revalidate, proxy-revalidate'
  );
  res.status(200).json({ authenticated: true, user: req.session.user });
};
