// Define a component responsible for formatting a single course called Course.
const Course = ({course}) => {
  
    const Header = ({ courseName }) => <h1>{courseName}</h1>
      
    const Content = ({ parts }) => {
      const Part = ({ part }) => <p>{part.name} {part.exercises}</p>
      return (
      <>
        {parts.map(part => 
          <Part key={part.id} part={part} />
        )}
      </>
      )
    }
  
    const Total = ({course}) => {
      const reduceTotal = course.parts.reduce((sum, part) => sum + part.exercises, 0)
      return <strong><p>total of {reduceTotal} exercises</p></strong>
    }
  
    return (
      <div>
        <Header courseName = {course.name}/>
        <Content parts = {course.parts}/>
        <Total course = {course}/>
      </div>
    )}
    
export default Course  