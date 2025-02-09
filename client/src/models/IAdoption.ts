interface IAdoption {
    _id: string;
    name: string;
    species: string;
    breed: string;
    age: number;
    gender: string;
    description: string;
    imageUrl: string;
    status: string;
    addedBy: {
      _id: string;
      username: string;
    };
    adoptedBy?: {
      _id: string;
      username: string;
    };
    createdAt: string;
    updatedAt: string;
  }