export interface ProblemDetailsResponse {
	type?: string;
	title?: string;
	status?: number;
	detail?: string;
	instance?: string;
}

export interface HttpProblemDetailsResponse extends ProblemDetailsResponse {
	errors?: { [key: string]: string[] };
}
