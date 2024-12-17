// express
import { Router, Response } from 'express';

// mongodb
import { ObjectId } from 'mongodb';

// types
import { ExtendedRequest } from '@/types';

const router = Router();

// **Create**: Insert a new document
router.post('/:resource', async (req: ExtendedRequest, res: Response) => {
  try {
    const result = await req.collection?.insertOne(req.body);
    res.status(201).send(result);
  } catch (error) {
    res.status(500).send({ error: 'Failed to insert document', details: error });
  }
});

// **Read**: Get all documents in a collection
router.get('/:resource', async (req: ExtendedRequest, res: Response) => {
  try {
    const documents = await req.collection?.find().toArray();
    res.send(documents);
  } catch (error) {
    res.status(500).send({ error: 'Failed to retrieve documents', details: error });
  }
});

// **Read One**: Get a single document by ID
router.get('/:resource/:id', async (req: ExtendedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const document = await req.collection?.findOne({ _id: new ObjectId(id) });
    if (!document) {
      res.status(404).send({ error: 'Document not found' });
      return;
    }
    res.send(document);
  } catch (error) {
    res.status(500).send({ error: 'Failed to retrieve document', details: error });
  }
});

// **Update**: Update a document by ID
router.put('/:resource/:id', async (req: ExtendedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const result = await req.collection?.updateOne({ _id: new ObjectId(id) }, { $set: req.body });
    if (result?.modifiedCount === 0) {
      res.status(404).send({ error: 'Document not found or not updated' });
      return;
    }
    res.send(result);
  } catch (error) {
    res.status(500).send({ error: 'Failed to update document', details: error });
  }
});

// **Delete**: Delete a document by ID
router.delete('/:resource/:id', async (req: ExtendedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const result = await req.collection?.deleteOne({ _id: new ObjectId(id) });
    if (result?.deletedCount === 0) {
      res.status(404).send({ error: 'Document not found or not deleted' });
      return;
    }
    res.send(result);
  } catch (error) {
    res.status(500).send({ error: 'Failed to delete document', details: error });
  }
});

export default router;
