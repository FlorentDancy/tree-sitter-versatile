module.exports = grammar({
  name: 'versatile',

  rules: {
    Protocol: $ => $.Definitions,

    Definitions: $ => choice(
      $.Definition,
      seq($.Definitions, $.Definition)
    ),

    Definition: $ => seq("{", $.Fields, "}"),

    Fields: $ => choice(
      $.Field,
      seq($.Fields, $.Field)
    ),

    Field: $ => choice(
      seq($.Name, "[", $.Index, "]", "=", choice($.Definition, seq($.Directive, $.Definition))),
      seq($.Name, "=", "[", $.Definitions, "]"),
      seq($.Name, "=", $.Fields),
      seq($.Name, "=", $.Expression)
    ),

    Index: $ => seq("$", /[0-9]+,/),

    Name: $ => $.Identifier,

    Identifier: $ => /[A-Za-z_\\][0-9A-Za-z_\-]*/,

    Expression: $ => choice(
      $.FunctionCall,
      $.NumberConstant,
      $.StringConstant,
      $.Member,
    ),

    Expressions: $ => choice(
      $.Expression,
      seq($.Name, "[", /[0-9]+/, ":", /[0-9]+/, "]"),
      seq($.Expressions, ",", $.Expressions)
    ),

    FunctionCall: $ => seq($.Identifier,  "(", optional($.Expressions), ")"),

    Directive: $ => $.Expression,

    NumberConstant: $ => seq(/[0-9]+(\.[0-9]+)?/),

    StringConstant: $ => /\"[^"]*\"/,

    Member: $ => seq($.Identifier, optional(repeat($.MemberSubscript))),

    MemberSubscript: $ => choice(
      seq(".", $.Identifier),
      seq("[", /[0-9]+/, "]"),
      seq("[", "$", /[0-9]+/, "]")
    ),
  }
});
