export default async function handler(req, res) {
  const { id } = req.query;
  
  if (req.method === 'PUT') {
    try {
      const updatedSubscription = await prisma.subscription.update({
        where: { id: parseInt(id) },
        data: req.body
      });
      
      res.status(200).json(updatedSubscription);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update subscription' });
    }
  }
}