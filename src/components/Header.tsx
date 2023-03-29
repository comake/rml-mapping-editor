import ThemeToggle from './ThemeToggle';

function Header() {
  return (
    <div className='RML-Editor-Header RML-Editor-Centered'>
      <div className='RML-Editor-Logo'>RML Mapping Editor</div>
      <ThemeToggle />
    </div>
  )
}

export default Header;