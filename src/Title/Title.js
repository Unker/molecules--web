import React from 'react'
import { Link } from 'react-router-dom'
import s from './Title.module.css'

import cn from 'classnames'

const Title = () => {
	return (
		<>
		  <div >
			<Link to="/" className={s.title}><div>NFT  AI  MOLECULES</div></Link>
			<h2 className={s.h2}>Purchase of intellectual property</h2>
			
		  </div>
		</>
	)
}

export default Title
