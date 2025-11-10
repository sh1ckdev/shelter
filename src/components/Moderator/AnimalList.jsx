import PropTypes from 'prop-types';

const AnimalList = ({ animals, onEdit, onDelete }) => {
  if (animals.length === 0) {
    return (
      <li className="p-4 bg-gray-50 rounded-lg text-center text-gray-500">
        Животные не найдены
      </li>
    );
  }
  console.log(animals)
  return (
    <ul className="space-y-2">
      {animals.map((animal) => (
        <li
          key={animal._id}
          className="p-4 bg-gray-50 rounded-lg flex justify-between items-center"
        >
          <div>
            <span className="font-semibold">{animal.name}</span>{" "}
            ({animal.species}, {animal.age} лет)
          </div>
          <div>
            <button

              onClick={() => onEdit(animal)}
              className="mr-2 px-2 py-1 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
            >
              Редактировать
            </button>
            <button
              onClick={() => onDelete(animal._id)}
              className="px-2 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              Удалить
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
};

AnimalList.propTypes = {
    animals: PropTypes.arrayOf(
      PropTypes.shape({
        _id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        type: PropTypes.string.isRequired,
        age: PropTypes.number.isRequired
      })
    ).isRequired,
    onEdit: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired
  };

export default AnimalList;