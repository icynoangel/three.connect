
var THREE = {
  Vector3: jest.genMockFunction().mockImplementation( () => {
    return {
      unproject: jest.genMockFunction().mockReturnThis(),
      sub: jest.genMockFunction().mockReturnThis(),
      normalize: jest.genMockFunction().mockReturnThis()
    };
  }),
  Raycaster: jest.genMockFunction().mockImplementation( () => {
    return {
      intersectObjects: jest.genMockFunction().mockImplementation( () => {
        return [
          { object: 
            {
              name: 'testMesh'
            }
          }
        ];
      })
    };
  })
};

module.exports = THREE;
