/*
 * Copyright (c) 2021, J2 Innovations. All Rights Reserved
 */

/**
 * A node that generates code.
 */
export interface Node {
	/**
	 * Generate the code.
	 *
	 * @param out A function used to output the code followed by a newline.
	 */
	generate(out: (code: string) => void): void

	/**
	 * The number of new lines after the node has generated code.
	 */
	newLines: number
}
