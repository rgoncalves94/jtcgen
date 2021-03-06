var eq = function(expected, methodToCall) {
	
	if(methodToCall != undefined) return eqVoid(expected, methodToCall);
	
	if(!helper.isDiffType(expected, '[object Array]')) {
		throw exception.invalidParam("[InvalidParamException] Tipo de parametro inválido na classe: "+actualClazz.getSimpleName()+" no método '.eq()' . Este método apenas suporta tipos primitivos. Ex: 'example' ou 200.50;");
	}
	
	if(!helper.isDiffType(expected, '[object Object]')) {
		throw exception.invalidParam("[InvalidParamException] Tipo de parametro inválido na classe: "+actualClazz.getSimpleName()+" no método '.eq()' . Este método apenas suporta tipos primitivos. Ex: 'example' ou 200.50;");
	}
	
	var assert = "assertEquals";
	var instance = actualClazz.getSimpleName().toLowerCase();
	var returnType = actualMethod.getReturnType().getSimpleName();
	var noRepeatVarCount = (NashornBag.getCountExpected() == 0) ? "" : NashornBag.getCountExpected();
	
	mockery.exec();
	
	var stack = mockery.stack;
	var str = setupBuffer + buffer + stack.value;
	
	var paramAdd = "";
	
	if(returnType == "double") {
		paramAdd = ", 0.0001";
		
		if(regex.isInteger(expected)) 
			expected = expected.toFixed(1);
	} else if(returnType == "String") {
		if(!/^\'.+\'$/.test(expected))
			expected = "'"+expected+"'";
	}
	
	str += TextEditor.newLine(
			regex.replaces(templates.assert, {
			shortClazzLower: instance + noRepeatVarCount,
			'returns': returnType,
			'assert': assert,
			'expected': expected,
			'method': actualMethod.getName(),
			'params': stack.params,
			'paramAdd': paramAdd,
			'expectedCount': noRepeatVarCount
		})
	, 2);
	
	NashornBag.incrementExpectedCount();
	
	return str;
}