#pragma once

#include <bench/tests/qdb/qdb_test_template.hpp>
#include <utils/random.hpp>

namespace bench
{
namespace tests
{
namespace qdb
{
namespace deque
{
class push_back : public qdb_test_template<push_back>
{
public:
    explicit push_back(bench::test_config config) : qdb_test_template(config)
    {
        _content = utils::create_random_string(config.content_size);
    }

    void run_iteration(unsigned long iteration)
    {
        _qdb.deque_push_back(alias(0), _content);
    }

    void cleanup() override
    {
        _qdb.remove(alias(0));
    }

    static std::string name()
    {
        return "qdb_deque_push_back";
    }

    static std::string description()
    {
        return "Each thread repeats qdb_deque_push_back() on a queue";
    }

    static bool size_dependent()
    {
        return true;
    }

private:
    std::string _content;
};
} // namespace deque
} // namespace qdb
} // namespace tests
} // namespace bench
